import React from 'react';
import { Text } from 'react-native';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import CryptrRefreshButton from '../../components/CryptrRefreshButton';
import { Locale } from '../../utils/enums';
import Cryptr from '../../models/Cryptr';
import { fireEvent, render } from '@testing-library/react-native';
interface JsonTree {
  children: any;
}

jest.mock('../../models/Cryptr', () => ({
  startSecuredView: jest.fn(),
  getRefresh: jest.fn(),
  setRefresh: jest.fn(),
}));

describe('CryptrRefreshButton', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };

  it('should mount and allow cryptr logout button', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrRefreshButton />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children).toBeNull();
  });

  it('should display button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrRefreshButton autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Refresh']);
    expect(tree.root.findByType(CryptrRefreshButton).props).toEqual({
      autoHide: false,
    });
  });

  it('should display french button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrRefreshButton autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Rafraîchir']);
    expect(tree.root.findByType(CryptrRefreshButton).props).toEqual({
      autoHide: false,
    });
  });

  it('should display custom button when autoHide false', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrRefreshButton text="Remove session" autoHide={false} />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Remove session']);
    expect(tree.root.findByType(CryptrRefreshButton).props).toEqual({
      autoHide: false,
      text: 'Remove session',
    });
  });

  it('mount button with custom children', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrRefreshButton autoHide={false}>
          <Text>Custom refersh content</Text>
        </CryptrRefreshButton>
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Custom refersh content']);
  });

  it('should start refresh process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrRefreshButton autoHide={false}>
          <Text>Custom idp content</Text>
        </CryptrRefreshButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const getRefreshFn = jest.spyOn(Cryptr, 'getRefresh');
    fireEvent.press(item);
    expect(getRefreshFn).toHaveBeenCalled();
  });
});
