import React from 'react';
import { Text } from 'react-native';
import type { CryptrConfig } from '../../utils/interfaces';
import CryptrProvider from '../../models/CryptrProvider';
import renderer from 'react-test-renderer';
import useCryptr from '../../useCryptr';
interface JsonTree {
  children: any;
}

const LoadingComponent = () => {
  const { isLoading } = useCryptr();

  return (
    <Text testID="loading">{isLoading ? 'Loading...' : 'Not Loading'}</Text>
  );
};

const AuthenticationComponent = () => {
  const { isAuthenticated } = useCryptr();

  return (
    <Text testID="loading">
      {isAuthenticated ? 'Authenticated' : 'Unauthenticated'}
    </Text>
  );
};

describe('CryptrProvider', () => {
  const config: CryptrConfig = {
    tenant_domain: 'shark_academy',
    client_id: '123',
    audience: 'cryptr://audience',
    default_redirect_uri: 'cryptr://redirect-uri',
  };

  it('should mount as simple', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <Text>Cryptr child</Text>
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children).toEqual(['Cryptr child']);
  });

  it('should mount with initial loading state', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <LoadingComponent />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children).toEqual(['Not Loading']);
  });

  it('should mount with initial authneticated state', () => {
    const tree = renderer.create(
      <CryptrProvider {...config}>
        <AuthenticationComponent />
      </CryptrProvider>
    );
    expect(tree).not.toBeUndefined();
    const jsonTree = tree.toJSON() as JsonTree;
    expect(jsonTree.children).toEqual(['Unauthenticated']);
  });
});
