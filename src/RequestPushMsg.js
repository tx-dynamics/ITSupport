export const sendNotificationFirebaseAPI = async (token, title, body) => {
  console.log('token', token);
  const FIREBASE_API_KEY =
    'AAAAvPAHhPg:APA91bEbm-exN5dCnYMP630Ycu0LAonBs7railikaqfcxg18OVDOQzsDy3230DQ-94HJRLFR5kGox3G6os9h-Z3ZzGMSiVHhcOloe6LXSVpfyB5IKsmkrue9siB5o6MnY4H5dhuobc6A';
  const message = {
    registration_ids: [token],
    notification: {
      title: `New Message From ${title}`,
      body: body,
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
    data: {
      title: title,
      body: body,
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json,text/plain, */*',
    Authorization: 'key=' + FIREBASE_API_KEY,
  });

  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.text();
  console.log(response);
};
