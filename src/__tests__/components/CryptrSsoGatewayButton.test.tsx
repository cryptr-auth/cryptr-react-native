import React from 'react';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrSsoGatewayButton from '../../components/CryptrSsoGatewayButton';
import { Locale } from '../../utils/enums';
import { Text } from 'react-native';
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

describe('CryptrSsoGatewayButton', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };

  it('should mount in provider', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in with SSO']);
    expect(tree.root.findByType(CryptrSsoGatewayButton).props).toEqual({});
  });

  it('should mount in provider and allow french locale', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrSsoGatewayButton />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Se connecter en SSO']);
    expect(tree.root.findByType(CryptrSsoGatewayButton).props).toEqual({});
  });

  it('should mount in provider and allow non blank idpId string', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton idpId={'shark_academy_12fregerg'} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in with SSO']);
    expect(tree.root.findByType(CryptrSsoGatewayButton).props).toEqual({
      idpId: 'shark_academy_12fregerg',
    });
  });

  it('should mount in provider and allow non blank and non empty idpId string array', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton
          idpId={['shark_academy_12fregerg', 'company_fzef1238']}
        />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in with SSO']);
    expect(tree.root.findByType(CryptrSsoGatewayButton).props).toEqual({
      idpId: ['shark_academy_12fregerg', 'company_fzef1238'],
    });
  });

  it('should throw error if blank idpId string', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrSsoGatewayButton idpId={''} />
        </CryptrProvider>
      )
    ).toThrow('Please provide non blank string(s) for idpId');
  });

  it('should throw error if empty idpId string array', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrSsoGatewayButton idpId={[]} />
        </CryptrProvider>
      )
    ).toThrow('Please provide non blank string(s) for idpId');
  });

  it('should throw error if blank idpId string array', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrSsoGatewayButton idpId={['']} />
        </CryptrProvider>
      )
    ).toThrow('Please provide non blank string(s) for idpId');
  });

  it('should throw error if one blank item in idpId string array', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrSsoGatewayButton idpId={['idp_id', '']} />
        </CryptrProvider>
      )
    ).toThrow('Please provide non blank string(s) for idpId');
  });

  it('should mount in provider and custom text', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton text="Access to gateway" />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Access to gateway']);
    expect(tree.root.findByType(CryptrSsoGatewayButton).props).toEqual({
      text: 'Access to gateway',
    });
  });

  it('should mount in provider and allow custom children', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton text="Access to gateway">
          <Text>Custom button text</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Custom button text']);
  });

  it('should start standard gateway process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton>
          <Text>Custom idp content</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://auth.cryptr.eu/t/shark_academy/?client_id=123'
      ),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_id='),
      false,
      expect.anything(),
      expect.anything()
    );

    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_ids%5B%5D='),
      false,
      expect.anything(),
      expect.anything()
    );

    startSecuredViewFn.mockRestore();
  });

  it('should start standard gateway process without no_popup_no_cookie is true on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config} no_popup_no_cookie={true}>
        <CryptrSsoGatewayButton>
          <Text>Custom idp content</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://auth.cryptr.eu/t/shark_academy/?client_id=123'
      ),
      true,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_id='),
      true,
      expect.anything(),
      expect.anything()
    );

    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_ids%5B%5D='),
      true,
      expect.anything(),
      expect.anything()
    );

    startSecuredViewFn.mockRestore();
  });

  it('should start standard dedicated gateway process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config} dedicated_server={true}>
        <CryptrSsoGatewayButton>
          <Text>Custom idp content</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('https://auth.cryptr.eu/?client_id'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_id='),
      false,
      expect.anything(),
      expect.anything()
    );

    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('idp_ids%5B%5D='),
      false,
      expect.anything(),
      expect.anything()
    );

    startSecuredViewFn.mockRestore();
  });

  it('should start idp gateway process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton idpId="app_sso_idp_id">
          <Text>Custom idp content</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('idp_id=app_sso_idp_id'),
      false,
      expect.anything(),
      expect.anything()
    );
    startSecuredViewFn.mockRestore();
  });

  it('should start idps gateway process on press action', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrSsoGatewayButton idpId={['app_sso_idp_id', 'another_idp_id']}>
          <Text>Custom idp content</Text>
        </CryptrSsoGatewayButton>
      </CryptrProvider>
    );
    const item = getByText('Custom idp content');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('idp_ids%5B%5D=app_sso_idp_id'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('idp_ids%5B%5D=another_idp_id'),
      false,
      expect.anything(),
      expect.anything()
    );
    startSecuredViewFn.mockRestore();
  });
});
