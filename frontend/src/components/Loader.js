import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="blue ball" />
        <div className="red ball" />
        <div className="yellow ball" />
        <div className="green ball" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.6); /* semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ball {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    margin: 0 10px;
    animation: 2s bounce ease infinite;
  }

  .blue {
    background-color: #4285f5;
  }

  .red {
    background-color: #ea4436;
    animation-delay: 0.25s;
  }

  .yellow {
    background-color: #fbbd06;
    animation-delay: 0.5s;
  }

  .green {
    background-color: #34a952;
    animation-delay: 0.75s;
  }

  @keyframes bounce {
    50% {
      transform: translateY(25px);
    }
  }
`;

export default Loader;
