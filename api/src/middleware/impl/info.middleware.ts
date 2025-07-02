export class InfoMiddleware {
  
  private endpoint: string = 'http://ip-api.com/json/85.57.72.109';

  constructor() {
    this.getInfo();
  }

  getInfo() {
    fetch(this.endpoint)
      .then(response => response.json())
      .then(data => {
        console.log('User Information:', data);
      })
      .catch(error => {
        console.error('Error fetching IP information:', error);
      });
  }
}