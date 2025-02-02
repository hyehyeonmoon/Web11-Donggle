import styled from 'styled-components';

const SnackbarDiv = styled.div<{ error: boolean }>`
  position: fixed;
  top: 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  font-size: ${(props) => props.theme.fontSizes.paragraph};
  background: ${(props) => props.theme.colors.lightgreen};
  color: ${(props) =>
    props.error ? props.theme.colors.red : props.theme.colors.white};
  border-radius: 10px;
  animation-name: pop;
  animation-duration: 3s;
  animation-fill-mode: forwards;

  @keyframes pop {
    0% {
      top: -50px;
    }
    20% {
      top: 0px;
    }
    80% {
      top: 0px;
    }
    100% {
      top: -50px;
    }
  }
`;

export { SnackbarDiv };
