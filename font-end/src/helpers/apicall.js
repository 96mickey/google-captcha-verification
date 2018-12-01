let BaseUrl = "https://interview-tasks-personal-mickey96.c9users.io:8081/"

export function PostData(type, userData) {
  let token = localStorage.token;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + type, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function GetData(type) {
  let token = localStorage.token;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + type, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-auth-token": token
      }
    })
      .then(response => response.json())
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function DeleteData(type) {
  let token = localStorage.token;

  return new Promise((resolve, reject) => {
    fetch(BaseUrl + type, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-auth-token": token
      }
    })
      .then(response => response.json())
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
