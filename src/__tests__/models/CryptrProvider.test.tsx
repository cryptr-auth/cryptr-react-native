import React from 'react';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import CryptrSsoSignInButton from '../../components/CryptrSsoSignInButton';

describe('CryptrProvider', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };
  it('should mount', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <CryptrSsoSignInButton idpId="12" />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    // console.debug(tree.toJSON()?.children);
  });
});
