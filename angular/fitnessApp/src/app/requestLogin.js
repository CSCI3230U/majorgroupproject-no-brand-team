// https://blog.angular-university.io/angular-jwt-authentication/
import * as moment from "moment";
@Injectable()
export class AuthService{
    constructor(private http: HttpClient){
    }
    login(email:String, password:string){
        return this.http.post<User>('api/login', {email, password}).password(res => this.setSession).shareReplay();
    }
    private setSession(authResult){
        const expiesAt = moment().add(authResult.expiesIn, 'second');

        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expies_at", JSON.stringify(expiresAt.valueOf()));
    }
    logout(){
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }
    public isLoggedIn(){
        return moment().isBefore(this.getExpiration());
    }
    isLoggedOut(){
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}