import React, { useEffect, useState } from "react";
import { Layout, Col, Row } from "antd";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import TopBar from "./TopBar";
import SideBar from "./SideBar";

import useGetAllSLOs from "../../core/hooks/useGetAllSLOs";

import "./app.css";
import Loader from "../../components/Loader";
import { ISLO } from "../../core/interfaces/ISLO";
import SLODrawer from "./Drawer";
import SLO from "./SLO";
// import Overview from "./Overview/Overview";
import SLOTable from "./Overview/SLOOverview";
import { SLOtrackerLogo } from "../../assets";

const { Header, Content, Sider } = Layout;

const AppView: React.FC = () => {
	const { loading, error, SLOs, refreshSLOs } = useGetAllSLOs();
	const [activeSLO, setActiveSLO] = useState<ISLO | null>(null);
	const [sloDrawer, setSLODrawer] = useState<{
		type: "create" | "update";
		show: boolean;
	}>({ type: "create", show: false });

	const closeSLODrawer = () => setSLODrawer({ ...sloDrawer, show: false });
	const openSLODrawer = (type: "create" | "update") => () =>
		setSLODrawer({ type, show: true });

	useEffect(() => {
		if (!activeSLO && SLOs.length) setActiveSLO(SLOs[0]);

		if (!activeSLO) return;

		// Reset activeSLO to first if no activeSLO is not part of SLOs
		// Used to reset on delete SLO
		if (!SLOs.some((s) => s.id === activeSLO.id))
			setActiveSLO(SLOs.length ? SLOs[0] : null);

		// Update active SLO when slos change
		const activeSLOsArray = SLOs.filter((s) => s.id === activeSLO.id);
		const newActiveSLO = activeSLOsArray[0];

		if (newActiveSLO && activeSLO.id === newActiveSLO.id) {
			if (
				activeSLO.slo_name !== newActiveSLO.slo_name ||
				activeSLO.target_slo !== newActiveSLO.target_slo
			)
				setActiveSLO(newActiveSLO);
		}
	}, [SLOs, activeSLO]);

	const renderSideBar = () => {
		if (loading && !error) return <Loader marginTop="150px" />;
		else if (!loading && error)
			return (
				<p style={{ textAlign: "center", margin: "30px 10px" }}>{error}</p>
			);
		else if (!SLOs.length)
			return (
				<p style={{ textAlign: "center", margin: "30px 10px" }}>
					You have no SLOs. Create one to continue
				</p>
			);
		else
			return (
				<SideBar
					SLOs={SLOs}
					activeSLOId={activeSLO?.id}
					setActiveSlo={setActiveSLO}
				/>
			);
	};

	const SLOContent = () => {
		return (
			<>
				<Header className="app__layout_header app__layout-light_background">
					<Col>
						<Row justify="space-between">
							<SLOtrackerLogo />
							<TopBar onAddSLO={openSLODrawer("create")} />
						</Row>
					</Col>
				</Header>
				<Layout>
					<Sider
						breakpoint="lg"
						collapsedWidth="0"
						className="app__layout-light_background app__layout_fixed_layout"
					>
						{renderSideBar()}
					</Sider>
					<Content className="app__layout_fixed_layout">
						<SLO
							activeSLO={activeSLO}
							SLOsLoading={loading}
							onUpdateSLO={openSLODrawer("update")}
						/>
					</Content>
				</Layout>
			</>
		);
	};

	return (
		<Layout className="app__layout">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={SLOContent} />
					<Route
						exact
						path="/overview"
						component={() => (
							<SLOTable
								setActiveSLO={(activeSLO: ISLO) => {
									setActiveSLO(activeSLO);
								}}
							/>
						)}
					/>
				</Switch>
			</BrowserRouter>
			<SLODrawer
				type={sloDrawer.type}
				show={sloDrawer.show}
				activeSLO={activeSLO}
				onClose={closeSLODrawer}
				refreshSLOs={refreshSLOs}
			/>
		</Layout>
	);
};

export default AppView;
