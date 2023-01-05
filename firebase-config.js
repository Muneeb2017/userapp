import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyClfR42x--ZL21b2iu9zFyHGTTS75QNfag',
    authDomain: 'react-native-user-regdata.firebaseapp.com',
    projectId: 'react-native-user-regdata',
    storageBucket: 'react-native-user-regdata.appspot.com',
    messagingSenderId: '997429075679',
    appId: '1:997429075679:web:3a2d88166d83b9141f536a',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db};
