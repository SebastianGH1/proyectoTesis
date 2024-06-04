function ejecutarPHP(url, callback) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("error! Status:" + response.status);
        }
        return response.json();
      })
      .then(data => {
        callback(data);
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      });
  }