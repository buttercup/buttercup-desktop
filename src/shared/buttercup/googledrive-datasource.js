import { DatasourceAuthManager } from './buttercup';
import {
  authenticateGoogleDrive,
  authenticateGoogleDriveWithRefreshToken
} from '../../renderer/system/auth';

DatasourceAuthManager.getSharedManager().registerHandler(
  'googledrive',
  async datasource => {
    console.log('Google Drive datasource needs re-authentication');
    const {
      token: currentToken,
      refreshToken: currentRefreshToken
    } = datasource;
    if (!currentRefreshToken) {
      console.log(
        'Datasource does not contain a refresh token: Performing full authorisation'
      );
      const { accessToken, refreshToken } = await authenticateGoogleDrive();
      datasource.updateTokens(accessToken, refreshToken);
      if (!refreshToken) {
        console.warn(
          'Updating Google Drive datasource access token without refresh token'
        );
      }
    } else {
      console.log(
        'Datasource contains refresh token: Refreshing authorisation'
      );
      const { accessToken } = await authenticateGoogleDriveWithRefreshToken(
        currentToken,
        currentRefreshToken
      );
      datasource.updateTokens(accessToken, currentRefreshToken);
    }
    console.log('Google Drive datasource tokens updated');
  }
);
