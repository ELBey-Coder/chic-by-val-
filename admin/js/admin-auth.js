async function requireAdmin(){
  if(!storeDB){location.href="login.html?setup=1";return null}
  const {data:{session}}=await storeDB.auth.getSession();
  if(!session){location.href="login.html";return null}
  document.querySelectorAll(".admin-user-email").forEach(el=>el.textContent=session.user.email);return session.user;
}
async function adminSignOut(){if(storeDB)await storeDB.auth.signOut();location.href="login.html"}
