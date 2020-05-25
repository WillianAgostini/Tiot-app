ionic cordova build android --prod --release && 
cp -u platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk . &&
rm -f tiot.apk &&
jarsigner -storepass mixaria -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tiot.keystore app-release-unsigned.apk tiot &&
/opt/android-sdk/build-tools/29.0.3/zipalign -v 4 app-release-unsigned.apk tiot.apk

