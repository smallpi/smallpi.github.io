# 关于 build.gradle 

------------------------------------------

```

gradle 是 Android 开发的 build system

使用Android studio生成的工程有两个build.gradle文件

根目录下的 ./build.gradle
	针对module的全局配置(包含的module由settings.gradle配置)
	app文件夹是一个module
	当工程新增一个module lib, 需要在settings.gradle中包含新的module
	
	buildscript{
		repositories{
			jcenter()
		}
		dependencies{
			classpath 'com.android.tools.build:gradle:2.2.3'  //android特有的插件
		}
	}
	allprojects {
		repositories {
			jcenter()	//通过jcenter获取maven仓库地址，默认的maven仓库
			maven{		//获取额外的maven仓库地址
				url 'http://mvnrepo.xxx.com/mvn/repository'
			}
		}
	}
	
./app/build.gradle
	
	apply plugin: 'com.android.application'		//构建项目类型
	apply plugin: 'org.greenrobot.greendao'     //greendao
	android{
		compileSdkVersion 25					//
		buildToolsVersion "25.0.2"
		defaultConfig {
			applicationId "cn.smallpi.record"
			minSdkVersion 15					//支持的最小sdk版本
			targetSdkVersion 25					//目标sdk版本
			versionCode 1	
			versionName "1.0"
			testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
		}
		buildTypes {							//混淆设置
			release {
				minifyEnabled false				//是否开启混淆
				proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
			}
		}
	}
	
	dependencies {								//编译android依赖库
		compile fileTree(include: ['*.jar'], dir: 'libs')
		androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
			exclude group: 'com.android.support', module: 'support-annotations'
		})
		compile 'com.android.support:appcompat-v7:25.1.0'
		testCompile 'junit:junit:4.12'
		compile 'com.android.support:design:25.1.0'
		compile 'com.android.support:appcompat-v7:25.1.0'


		compile 'org.greenrobot:greendao-generator:3.2.0'
		compile 'org.greenrobot:greendao:3.2.0'
	}

settings.gradle

```