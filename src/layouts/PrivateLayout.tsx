import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { banksStore, userStore } from "@/stores";
import {
	faBank,
	faCreditCard,
	faGift,
	faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

type Props = {};

const PrivateLayout = observer((props: Props) => {
	const { user } = userStore();
	const navigate = useNavigate();
	const routeHandler = (str: string) => () => {
		navigate(str);
	};
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([banksStore().fetchBanks()]).finally(() => {
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div style={{ height: "100vh" }}>
				<LoadingIndicator fullHeightAndWidth />
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="flex-row align-middle">
				<Sidebar>
					<SidebarHeader>
						<p className="text-gray-300 text-center font-bold text-2xl">
							{user.username}
						</p>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Entities</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("/banks")}
										>
											<FontAwesomeIcon icon={faBank} />
											<span>Banks</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("/cards")}
										>
											<FontAwesomeIcon icon={faCreditCard} />
											<span>Cards</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("/offers")}
										>
											<FontAwesomeIcon icon={faGift} />
											<span>Offers</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("/stores")}
										>
											<FontAwesomeIcon icon={faShop} />
											<span>Stores</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
			</div>
			<div className="p-10 w-full">
				<Outlet />
			</div>
		</SidebarProvider>
	);
});

export default PrivateLayout;
