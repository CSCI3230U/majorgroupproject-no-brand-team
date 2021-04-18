// https://blog.angular-university.io/angular-jwt-authentication/
@Injectable()
export class AuthInteceptor implements httpInterceptor{
    intercept(req: httpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const idToken = localStorage.getItem("id_token");
        if(idToken){
            const cloned = req.clone({
                headers: req.headers.set("Authorization", "Bearer" + idToken)
            });
            return next.handle(cloned);
        }
        else{
            return next.handle(req);
        }
    }
}