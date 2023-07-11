import React from 'react';
import renderer from 'react-test-renderer';
import type { CryptrConfig } from '../../utils/interfaces';
import { render, fireEvent } from '@testing-library/react-native';
import Cryptr from '../../models/Cryptr';
import CryptrProvider from '../../models/CryptrProvider';
import CryptrGatewayButton from '../../components/CryptrGatewayButton';
import { Locale } from '../../utils/enums';
import { Text } from 'react-native';

interface JsonTree {
  children: any;
}

jest.mock('../../models/Cryptr', () => ({
  startSecuredView: jest.fn(),
  getRefresh: jest.fn(),
  setRefresh: jest.fn(),
}));

describe('CryptrGatewayButton', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark-academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
    dedicated_server: true,
  };

  it('should mount in provider', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({});
  });

  it('should mount in provider nad allow french locale', () => {
    const tree = renderer.create(
      <CryptrProvider {...config} default_locale={Locale.FR}>
        <CryptrGatewayButton />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Se connecter']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({});
  });

  it('should mount in provider and allow undefined domain', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton domain={undefined} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({});
  });

  it('should mount in provider and allow blank domain', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton domain={''} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({
      domain: '',
    });
  });

  it('should mount in provider and allow non blank domain', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton domain={'org-domain'} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({
      domain: 'org-domain',
    });
  });

  it('should throw error if wrong domain', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrGatewayButton domain={'My Domain'} />
        </CryptrProvider>
      )
    ).toThrowError(
      'Please provide valid domain (alphanumeric dashed separated)'
    );
  });

  it('should throw error if blank email', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrGatewayButton email={' '} />
        </CryptrProvider>
      )
    ).toThrowError('Please provide non blank string for email');
  });

  it('should throw error if not email provided as email', () => {
    expect(() =>
      renderer.create(
        <CryptrProvider {...config}>
          <CryptrGatewayButton email={'org-domain'} />
        </CryptrProvider>
      )
    ).toThrowError('Please provide valid email');
  });

  it('should mount in provider if valid email provided', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton email={'john@company.com'} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({
      email: 'john@company.com',
    });
  });

  it('should mount in provider if valid complex email provided', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton email={'johny42+draft@ext.some-company.com'} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Sign in']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({
      email: 'johny42+draft@ext.some-company.com',
    });
  });

  it('should mount in provider if custom text provided', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton text={'Open my session'} />
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Open my session']);
    expect(tree.root.findByType(CryptrGatewayButton).props).toEqual({
      text: 'Open my session',
    });
  });

  it('should mount in provider if custom children provided', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrGatewayButton>
          <Text>Custom children text</Text>
        </CryptrGatewayButton>
      </CryptrProvider>
    );

    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children[0].children).toEqual(['Custom children text']);
  });

  it('should start gateway process on press action without domain neither email if no attrs provided', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrGatewayButton>
          <Text>Open Cryptr gateway</Text>
        </CryptrGatewayButton>
      </CryptrProvider>
    );

    const item = getByText('Open Cryptr gateway');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://auth.cryptr.eu/?client_id=123&locale=en'
      ),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('client_state='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('redirect-uri'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge_method=S256'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('domain='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('email='),
      false,
      expect.anything(),
      expect.anything()
    );
  });

  it('should start gateway process on press action with domain if provided', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrGatewayButton domain="company-domain">
          <Text>Sign in with domain</Text>
        </CryptrGatewayButton>
      </CryptrProvider>
    );

    const item = getByText('Sign in with domain');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://auth.cryptr.eu/?client_id=123&locale=en'
      ),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('client_state='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('redirect-uri'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge_method=S256'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('domain=company-domain'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('email='),
      false,
      expect.anything(),
      expect.anything()
    );
  });

  it('should start gateway process on press action with email if provided', () => {
    const { getByText } = render(
      <CryptrProvider {...config}>
        <CryptrGatewayButton email="john@company-domain.com">
          <Text>Sign in with domain</Text>
        </CryptrGatewayButton>
      </CryptrProvider>
    );

    const item = getByText('Sign in with domain');
    const startSecuredViewFn = jest.spyOn(Cryptr, 'startSecuredView');
    fireEvent.press(item);
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://auth.cryptr.eu/?client_id=123&locale=en'
      ),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('client_state='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('redirect-uri'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('code_challenge_method=S256'),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.not.stringContaining('domain='),
      false,
      expect.anything(),
      expect.anything()
    );
    expect(startSecuredViewFn).toHaveBeenCalledWith(
      expect.stringContaining('email=john%40company-domain.com'),
      false,
      expect.anything(),
      expect.anything()
    );
  });
});
