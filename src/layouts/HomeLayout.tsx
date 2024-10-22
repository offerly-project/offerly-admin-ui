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
import { userStore } from "@/stores";
import {
	faBank,
	faCreditCard,
	faGift,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { Outlet, useNavigate } from "react-router-dom";

type Props = {};

const HomeLayout = observer((props: Props) => {
	const { user } = userStore();
	const navigate = useNavigate();
	const routeHandler = (str: string) => () => {
		navigate(str);
	};
	return (
		<SidebarProvider>
			<div className="flex-row align-middle">
				<Sidebar>
					<SidebarHeader>
						<p className="text-gray-300 text-center font-bold text-2xl">
							{"Jad"}
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
											onClick={routeHandler("banks")}
										>
											<FontAwesomeIcon icon={faBank} />
											<span>Banks</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("cards")}
										>
											<FontAwesomeIcon icon={faCreditCard} />
											<span>Cards</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											style={{ height: 50 }}
											onClick={routeHandler("offers")}
										>
											<FontAwesomeIcon icon={faGift} />
											<span>Offers</span>
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

export default HomeLayout;
