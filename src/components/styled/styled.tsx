import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 300px; /* 이미지 크기 */
  height: 400px; /* 이미지 크기 */
  border-radius: 8px;
  overflow: hidden;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6); /* 반투명한 검정 배경 */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

export const SocialButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const IconButton = styled.a`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8); /* 반투명 흰색 배경 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  text-decoration: none;
  font-size: 1.2rem;

  &:hover {
    background: #fff; /* 호버 시 불투명한 흰색 */
  }
`;

export default IconButton;
