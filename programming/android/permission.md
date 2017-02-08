# 系统权限

------------------------

```
Android中的每个应用都有其独特的系统标识(Linux中的UID和GID)
系统中的各个部分都有不同的标识，从而区分应用和应用，系统和应用。

每个Android应用都在进程沙盒中进行( 独立的 Java虚拟机 )
	应用必须显示共享资源和数据
	通过权限获取沙盒提供的额外功能
	
Android应用
	每个应用(.apk)必须使用证书签署
	证书的私钥由开发者自己持有	在manifest中指定sharedUserId可以给不同的应用分配相同的UID。这样不同应用被视为相同的应用
	只有签署了同一签名的应用才能拥有相同的UID
	应用的数据会被分配应用的UID，用于用户的识别，不允许其他应用的访问
	在下列方法创建文件时，可以使用 MODE_WORLD_READABLE 和 MODE_WORLD_WRITEABLE 允许其他软件包读写本应用的文件
		getSharedPreferences(String,int)
		openFileOutput(String,int)
		openOrCreateDatabase(String,int,SQLiteDatabase.CursorFactory)

```

## 使用权限

--------------------------------------------

```
使用权限
	正常权限
		声明后系统会自动授予的权限
	危险权限			
		如果设备运行API等级大于等于23，且targetSdkVersion大于等于23，需用在应用运行时请求危险权限。
		权限失效会抛出 SecurityException
		危险权限回归类成权限组
		有了权限组的权限后，组内的所有权限都被授予
		
```

### 危险权限及其权限组

```
CALENDAR
	READ_CALENDAR
	WRITE_CALENDAR
CAMERA
	CAMERA
CONTACTS
	READ_CONTACTS
	WRITE_CONTACTS
	GET_ACCOUNTS
LOCATION
	ACCESS_FINE_LOCATION
	ACCESS_COARSE_LOCATION
MICROPHONE
	RECORD_AUDIO
PHONE
	READ_PHONE_STATE
	CALL_PHONE
	READ_CALL_LOG
	WRITE_CALL_LOG
	ADD_VOICEMAIL
	USE_SIP
	PROCESS_OUTGOING_CALLS
SENSORS
	BODY_SENSORS
SMS
	SEND_SMS
	RECEIVE_SMS
	READ_SMS
	RECEIVE_WAP_PUSH
	RECEIVE_MMS
STORAGE
	READ_EXTERNAL_STORAGE
	WRITE_EXTERNAL_STORAGE
```

### 定义自己的权限

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp" >
    <permission android:name="com.example.myapp.permission.DEADLY_ACTIVITY"
        android:label="@string/permlab_deadlyActivity"
        android:description="@string/permdesc_deadlyActivity"
        android:permissionGroup="android.permission-group.COST_MONEY"
        android:protectionLevel="dangerous" />
    ...
</manifest>
```

```
protectionLevel 必要属性
permissionGroup 可选属性 默认为标准系统组 android.Manifest.permission_group

adb shell pm list permissions 查看系统当前定义的权限
```


## 参考

-----------------------------------------------

1. [android系统提供的权限：Manifest.permission](https://developer.android.google.cn/reference/android/Manifest.permission.html)
2. [https://developer.android.google.cn/guide/topics/security/permissions.html#permissions](https://developer.android.google.cn/guide/topics/security/permissions.html#permissions)