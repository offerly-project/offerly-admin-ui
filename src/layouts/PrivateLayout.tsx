import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
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
import { isProduction } from "@/configs/configs";
import { banksStore, cardsStore, offersStore, userStore } from "@/stores";
import { routeFmt } from "@/utils/utils";
import {
	faBank,
	faCreditCard,
	faGift,
	faLocation,
	faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import momentTz from "moment-timezone";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

type Props = {};

const PrivateLayout = observer((props: Props) => {
	const { user } = userStore();
	const navigate = useNavigate();
	const routeHandler = (str: string) => () => {
		if (!isProduction) {
			navigate(str);
		} else {
			navigate(routeFmt(str));
		}
	};
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			banksStore().fetchBanks(),
			cardsStore().fetchCards(),
			offersStore().fetchOffers(),
		]).finally(() => {
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

	const timeZones = momentTz.tz.names();

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
									<Select onValueChange={userStore().updateTimezone}>
										<SelectTrigger>
											<FontAwesomeIcon icon={faLocation} className="mr-2" />
											TZ {">"} {userStore().tz}
										</SelectTrigger>
										<SelectContent>
											{timeZones.map((tz) => (
												<SelectItem value={tz}>
													{tz} {tz === userStore().tz && "(Current)"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={() => {
												userStore().logout();
											}}
										>
											<FontAwesomeIcon icon={faSignOut} />
											<span>Logout</span>
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
