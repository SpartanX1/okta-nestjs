
import { Injectable, CanActivate, ExecutionContext, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as OktaJwtVerifier from '@okta/jwt-verifier';

@Injectable()
export class OktaGuard implements CanActivate, OnModuleInit {

  oktaJwtVerifier: any;

  onModuleInit() {
    this.oktaJwtVerifier = new OktaJwtVerifier({
      issuer: 'https://{{host}}.okta.com/oauth2/default',
      clientId: 'your_client_id'
      // assertClaims: {
      //   'groups.includes': ['developer']
      // }
    });
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.getArgs()[0].headers.authorization.split(' ')[1];
    return this.oktaJwtVerifier.verifyAccessToken(token, 'your_audience')
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
