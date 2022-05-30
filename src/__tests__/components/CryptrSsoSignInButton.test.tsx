import React from 'react';
import { Text } from 'react-native';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import CryptrSsoSignInButton from '../../components/CryptrSsoSignInButton';
import { Locale } from '../../utils/enums';
import { render, fireEvent } from '@testing-library/react-native';
import Cryptr from '../../models/Cryptr';
interface JsonTree {
  children: any;
}
jest.mock('../../models/Cryptr', () => ({
  startSecuredView: jest.fn(),
  getRefresh: jest.fn(),
  setRefresh: jest.fn(),
}));

describe('CryptrSsoSignInButton', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };

  it('should mount and allow cryptrsso provider', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoSignInButton idpId="12" />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in with SSO']);
    expect(tree.root.findByType(CryptrSsoSignInButton).props).toEqual({
      idpId: '12',
    });
  });

  it('should mount and allow french cryptrsso provider', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrSsoSignInButton idpId="12" />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Se connecter en SSO']);
    expect(tree.root.findByType(CryptrSsoSignInButton).props).toEqual({
      idpId: '12',
    });
  });

  it('should mount and forbid idpidless cryptrsso provider', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config} default_locale={Locale.FR}>
          <CryptrSsoSignInButton idpId="" />
        </CryptrProvider>
      )
    ).toThrow("Please provide non blank value for 'idpId'");
  });

  it('should mount and allow cryptrsso button with custom test', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoSignInButton idpId="12" text="My custom text" />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['My custom text']);
  });

  it('should mount and allow cryptrsso button with custom children', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoSignInButton idpId="12">
          <Text>Custom idp content</Text>
        </CryptrSsoSignInButton>
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Custom idp content']);
  });

  it('should start sso process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrSsoSignInButton idpId="app_sso_idp_id">
          <Text>Custom idp content</Text>
        </CryptrSsoSignInButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringMatching(
        'https://auth.cryptr.eu/enterprise/app_sso_idp_id/login'
      ),
      expect.anything(),
      expect.anything()
    );
  });
});
