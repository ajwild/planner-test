<script>
  import { Link } from "svelte-routing";
  import {
    Header,
    HeaderAction,
    HeaderActionLink,
    HeaderActionSearch,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    HeaderPanelDivider,
    HeaderPanelLinks,
    HeaderUtilities
  } from "carbon-components-svelte";
  import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20";
  import Help20 from "carbon-icons-svelte/lib/Help20";
  import Notification20 from "carbon-icons-svelte/lib/Notification20";
  import UserAvatar20 from "carbon-icons-svelte/lib/UserAvatar20";

  let iAccount = {
    render: UserAvatar20,
    title: "Account"
  };

  let iHelp = {
    render: Help20,
    title: "Help"
  };

  let iNotifications = {
    render: Notification20,
    title: "Notifications"
  };

  let iSettings = {
    render: SettingsAdjust20,
    title: "Settings"
  };
</script>

<div class="sortable-autoscroll-header">
  <Header href="#" company="Training Planner" platformName="...">
    <HeaderNav>
      <HeaderNavItem href="/" text="Home" />
      <HeaderNavMenu text="Sub Menu">
        <HeaderNavItem href="/" text="Link 1" />
        <HeaderNavItem href="/" text="Link 2" />
        <HeaderNavItem href="/" text="Link 3" />
      </HeaderNavMenu>
    </HeaderNav>
    <HeaderUtilities>
      <HeaderActionSearch />
      <HeaderAction type="Settings" icon={iSettings}>
        <HeaderPanelLinks>
          <HeaderPanelDivider>Settings</HeaderPanelDivider>
        </HeaderPanelLinks>
      </HeaderAction>
      <HeaderActionLink type="Help" icon={iHelp} />
      <HeaderAction type="Notifications" icon={iNotifications}>
        <HeaderPanelLinks>
          <HeaderPanelDivider>Notifications</HeaderPanelDivider>
        </HeaderPanelLinks>
      </HeaderAction>
      <HeaderActionLink type="Account" icon={iAccount} />
    </HeaderUtilities>
  </Header>
</div>
