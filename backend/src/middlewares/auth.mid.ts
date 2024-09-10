import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  const token = req.headers.access_token as string;
  if (!token) return res.status(HTTP_UNAUTHORIZED).send();

  try {
    const decodedUser = verify(token, process.env.JWT_SECRET!); // check the token if it is valid
    req.user = decodedUser;
  } catch (error) {
    res.status(HTTP_UNAUTHORIZED).send();
  }

  return next();
};

// router.use(auth)
// export default router
// responsible for checking of the user when we do request on an API that is necessary for the user to be authenticated

// Adding HTTP interceptor
/*
ng g interceptor auth

ng g interceptor guards/auth
-> auth.interceptor.ts
inject userService

inside intercept function
const user = this.userService.currentUser;

if(user.token)
{
  request = request.clone({
    setHeaders:{
      access_token: user.token
    }
  })
}

providers: [
  {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true}
]



*/
