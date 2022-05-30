import React from 'react';
import { Text } from 'react-native';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import CryptrLogOutButton from '../../components/CryptrLogOutButton';
import { Locale } from '../../utils/enums';
import { fireEvent, render } from '@testing-library/react-native';
import Cryptr from '../../models/Cryptr';
interface JsonTree {
  children: any;
}

jest.mock('../../models/Cryptr', () => ({
  startSecuredView: jest.fn(),
  getRefresh: jest.fn(),
  setRefresh: jest.fn(),
}));

describe('CryptrLogOutButton', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };

  it('should mount and allow cryptr logout button', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrLogOutButton />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children).toBeNull();
  });

  it('should display button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrLogOutButton autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Log out']);
    expect(tree.root.findByType(CryptrLogOutButton).props).toEqual({
      autoHide: false,
    });
  });

  it('should display french button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrLogOutButton autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Déconnexion']);
    expect(tree.root.findByType(CryptrLogOutButton).props).toEqual({
      autoHide: false,
    });
  });

  it('should display custom button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrLogOutButton text="Remove session" autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Remove session']);
    expect(tree.root.findByType(CryptrLogOutButton).props).toEqual({
      autoHide: false,
      text: 'Remove session',
    });
  });

  it('mount logout button with custom children', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrLogOutButton autoHide={false}>
          <Text>Custom logout content</Text>
        </CryptrLogOutButton>
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Custom logout content']);
  });

  it('should start sso process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrLogOutButton autoHide={false}>
          <Text>Custom idp content</Text>
        </CryptrLogOutButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const getRefreshFn = jest.spyOn(Cryptr, 'getRefresh');
    fireEvent.press(item);
    expect(getRefreshFn).toHaveBeenCalled();
  });
});
