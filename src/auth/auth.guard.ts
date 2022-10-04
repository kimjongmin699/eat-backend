import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AllowedRoles, ALLOWED_ROLES } from 'src/auth/role.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      ALLOWED_ROLES,
      context.getHandler(),
    );
    if (!roles) {
      // if resolver is public, pass guard
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const { token } = gqlContext;
    console.log('token111111111', token);
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      console.log(decoded);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const user = await this.userService.findById(decoded['id']);
        if (!user) {
          return false;
        }
        console.log('user1111111', user);
        gqlContext['user'] = user;
        if (roles.includes('Any')) {
          return true;
        }
        return roles.includes(user.role);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
