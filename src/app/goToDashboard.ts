import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { IUser } from './login/user.interface';

export async function goToDashboard(app: AppService): Promise<boolean> {
  if (app.token == '') {
    let token: string | null = localStorage.getItem('suhba');
    if (token == null) {
      return false;
    } else {
      app.token = token;
      app.initHeaders();
      if (app.user == undefined) {
        await app.loading();
        try {
          let data = await firstValueFrom(
            app.get<{ user: IUser }>(`auth/validToken`, 'loginData')
          );
          app.user = data ? data.user : undefined;
          app.loadingController.dismiss();
          return true;
        } catch (err) {
          app.token = '';
          app.loadingController.dismiss();
          return false;
        }
      } else return true;
    }
  } else {
    app.initHeaders();
    return true;
  }
}