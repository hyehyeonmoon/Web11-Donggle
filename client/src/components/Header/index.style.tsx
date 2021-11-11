import styled from 'styled-components';

const LinkBtn = styled.button.attrs((props) => ({
  className: props.className,
}))`
  border: none;
  box-sizing: content-box;
  width: 85px;
  background-color: transparent;
  cursor: pointer;
  font-weight: normal;

  &.link-selected {
    color: #33ab74;
    font-weight: 700;
    text-decoration: solid underline #33ab74 2px;
  }
`;

const Layout = styled.div`
  position: relative;
  top: 0;
  display: flex;
  width: 100%;
  height: 80px;
  padding: 5px 10px;
`;

const Background = styled.div`
  position: relative;
  background: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 700px;
`;

const LogoMenuContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: start;
`;

const LogoWrapper = styled.div`
  width: 100px;
  height: 100%;
  margin-right: 10px;
  float: left;
  cursor: pointer;
`;

const MenuWrapper = styled.div`
  width: 250px;
  height: 100%;
  margin: 0;
  float: left;
`;

const MenuList = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Menu = styled.li`
  margin-left: 5px;
  cursor: pointer;
`;

const ProfileWrapper = styled.div`
  width: 50%;
  height: 100%;
  justify-content: flex-end;
  display: flex;
  align-items: center;
`;

const LoginBtn = styled.button`
  border: 1px solid ${(props) => props.theme.colors.lightgreen};
  border-radius: 10px;
  background: ${(props) => props.theme.colors.white};
  width: 100px;
  height: 40px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.lightgreen};
    color: ${(props) => props.theme.colors.white};
  }
`;

const LogoutBtn = styled(LoginBtn)`
  margin-right: 10px;
`;

const UserProfile = styled.div`
  margin: 0 15px;
  cursor: pointer;
`;

const ColorBar = styled.div`
  width: 100%;
  height: 30px;
  background: ${(props) => props.theme.colors.lightgreen};
`;

export {
  LinkBtn,
  Layout,
  Background,
  LogoMenuContainer,
  LogoWrapper,
  MenuWrapper,
  MenuList,
  Menu,
  ProfileWrapper,
  LoginBtn,
  LogoutBtn,
  UserProfile,
  ColorBar,
};