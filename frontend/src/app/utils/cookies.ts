//esta función renueva la cookie de sesión en el caso que esté creada.
export function renewCookieSession():void {
  const tokenCookie:any = readCookie('token')
  if (tokenCookie !== null){
    console.log(tokenCookie)
    const token:string = tokenCookie !== null
      ? tokenCookie
      : ''
    createCookieSession(token)
  }
}

//función para crear la cookie de sesión
export function createCookieSession(token:string):void {
  let fecha = new Date()
  fecha.setMinutes(fecha.getMinutes() + 5)
  document.cookie = "token=" + encodeURIComponent(token) + "; expires=" + fecha.toUTCString();
}

//función para eliminar la cookie
export function deleteCookieSession():void {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.localStorage.removeItem('user')
}

//función para leer una cookie
export function readCookie(name:string) {
  let nameEQ:string = name + "="; 
  let ca:string[] = document.cookie.split(';');

  for(let i=0;i < ca.length;i++) {
    let c:string = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) {
      return decodeURIComponent( c.substring(nameEQ.length,c.length) );
    }
  }
  return null;
}