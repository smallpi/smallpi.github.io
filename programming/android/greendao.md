# greendao(android orm数据库框架)

---------------------------------------

## gradle配置

-----------------------------------------

```gradle

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'org.greenrobot:greendao-gradle-plugin:3.2.1'
    }
}

apply plugin: 'com.android.application'
apply plugin: 'org.greenrobot.greendao'

dependencies {
	compile 'org.greenrobot:greendao-generator:3.2.0'
    compile 'org.greenrobot:greendao:3.2.0'
}

```


## 核心类

------------------------------------------

```
DaoMaster
	greenDAO的应用入口
	是对SQLiteDatabase的封装，可以获得SQLiteDatabase对象
	其中的内部类OpenHelper和DevOpenHelper是以SQLiteOpenHelper为接口的，可以用于建表等。
DaoSession
	管理所有的DAO对象
	也提供像insert,load,update,refresh和delete等实体持久化方法
Daos
	DAO对象，Database Access Object
	对于每个Entity, greendao自动生成一个DAO
	拥有比DaoSession更多的实体持久化方法
Entities
	实体类，一般为POJO
	
```

## ./app/build.gradle 中的各选配置

--------------------------------------------

```gradle

greendao {
    schemaVersion 1						
    daoPackage 'cn.smallpi.record.gen'
    targetGenDir 'src/main/java'
}

schemaVersion
	当前数据库schema的版本号，用于不同schema版本之间的迁移
	实体或者数据库schema改变时，该值要手动加1
daoPackage
	生成DAOs,DaoSession,DaoMaster的所在包名
targetGenDir
	产生的代码存放的目录
	与daoPackage合成最终存放目录
generateTests
	true 时自动产生单元测试
targetGenDirTests
	产生单元测试存放的目录
	
```

## Bean 注解

---------------------------------------------------

```java

@Entity		//标注Bean
@Entity(
	schema = "myschema",		//该Entity属于哪个schema
	active = true,				//active Entity有update,delete,和refresh方法
	nameInDb = "TABLE_NAME",	//对应的数据库表名
	indexes = {					//定义扩展多列的索引
        @Index(value = "name DESC", unique = true)
    },
	createInDb = false,			//是否创建表
	generateConstructors = true,	//产生构造函数
	generateGettersSetters = true	//创建getter和setter
	

@Id(autoincrement = true)		//主键 自增长	long或Long类型
@Property(nameInDb = "USERNAME")	//取个不一样的字段名，默认为CUSTOM_NAME
@NotNull						//非空
@Transient						//不进行持久化

@Index(unique = true)			//创建唯一的索引，额外的主键，name=NAME,索引取名
@Unique							//字段唯一，SQLite会自动创建索引
	
@Generated	//greenDao产生的代码标识
@Keep		//告诉greenDao不再干预这些代码

)	
```

## DaoSession产生的方法

----------------------------------------------------

```java

daoMaster = new DaoMaster(db);
daoSession = daoMaster.newSession();

```

## 缓存问题

---------------------------------------------------

```

一般情况下DaoSession具有缓存
	查询同一个id的User，返回指向同一个User的引用
	可以使用daoSession.clear() 清空缓存
	可以使用 noteDao.detachAll() 清空一个DAO的缓存
	
```

## Queries 查询

------------------------------------------------

### 使用QueryBuilder条件查询

```java

// 查询 first name “Joe”, ordered by last name 的所有用户
List<User> joes = userDao.queryBuilder()
  .where(Properties.FirstName.eq("Joe"))
  .orderAsc(Properties.LastName)
  .list();
  
```

```java

//1970年10月或10月后 的名为Joe的所有用户
QueryBuilder<User> qb = userDao.queryBuilder();
qb.where(Properties.FirstName.eq("Joe"),
qb.or(Properties.YearOfBirth.gt(1970),
qb.and(Properties.YearOfBirth.eq(1970), Properties.MonthOfBirth.ge(10))));
List<User> youngJoes = qb.list();


limit(int)  //限制查询返回的数量
offset(int) //跳过前面多少个，可以和limit一起使用

```

## greenDao中的类型

-------------------------------------------------------

```

boolean值 在表中是0或1的INTEGER
Date	在表中是Long值

```

## Query 和 LazyList

-------------------------------------------------------

```

希望查询多次时，可以使用QueryBuilder对象的build()方法产生Query对象
	Query对象可以查询多次
	
Query或QueryBuilder可以使用unique方法进行unique查询
	unique()  返回null 或实体
	uniqueOrThrow()  返回非空实体，否则抛出DaoException)
	
获得查询列表
	list()			//一般返回ArrayList
	listLazy()			//需要用时才将实体放进内存，并进行缓存，必须关闭
	listLazyUncached()	//虚拟的List,需要时查询，必须关闭
	listIterator()		//需要时才load数据，不缓存，必须关系
	
	listLazy和listIterator访问所有元素后会自动关闭cursor. j建议手动close()
	
```

## 多次条件查询

-------------------------------------------------------

```java

// fetch users with Joe as a first name born in 1970
Query<User> query = userDao.queryBuilder().where(
    Properties.FirstName.eq("Joe"), Properties.YearOfBirth.eq(1970)
).build();
List<User> joesOf1970 = query.list();
 
// using the same Query object, we can change the parameters
// to search for Marias born in 1977 later:
query.setParameter(0, "Maria");
query.setParameter(1, 1977);
List<User> mariasOf1977 = query.list();

```

```

多线程查询
	使用forCurrentThread()获取当前线程的Query

```

## Raw query 实现子查询

----------------------------------------------------------

```java

Query<User> query = userDao.queryBuilder().where(
  new StringCondition("_ID IN " +
    "(SELECT USER_ID FROM USER_MESSAGE WHERE READ_FLAG = 0)")
).build();

//另一个Raw Query
Query<User> query = userDao.queryRawCreate(
  ", GROUP G WHERE G.NAME=? AND T.GROUP_ID=G._ID", "admin"
);

```

## 调试方法

-----------------------------------------------------

```java

QueryBuilder.LOG_SQL = true;
QueryBuilder.LOG_VALUES = true;

```

## 表连接

-------------------------------------------------------

```java

// Address 和 User 通过 userID字段进行表连接   
// User  1对多	Address
// 默认使用User的Primary key

QueryBuilder<User> queryBuilder = userDao.queryBuilder();
queryBuilder.join(Address.class, AddressDao.Properties.userId)
  .where(AddressDao.Properties.Street.eq("Sesame Street"));
List<User> users = queryBuilder.list();

```

```java

//QueryBuilder的三种join方法

// 主实体的 primarykey 匹配 从实体的 destinationProperty
public <J> Join<T, J> join(Class<J> destinationEntityClass, Property destinationProperty)

// 主实体的 sourceProperty 匹配 从实体的 primarykey
public <J> Join<T, J> join(Property sourceProperty, Class<J> destinationEntityClass)

// 主实体的 sourceProperty 匹配 从实体的 destinationProperty
public <J> Join<T, J> join(Property sourceProperty, Class<J> destinationEntityClass,
    Property destinationProperty)

	
	
// 链式连接 (多个表连接)
public <J> Join<T, J> join(Join<?, T> sourceJoin, Property sourceProperty,
    Class<J> destinationEntityClass, Property destinationProperty)

// 链式连接例子
QueryBuilder<City> qb = cityDao.queryBuilder().where(Properties.Population.ge(1000000));
Join country = qb.join(Properties.CountryId, Country.class);
Join continent = qb.join(country, CountryDao.Properties.ContinentId,
  Continent.class, ContinentDao.Properties.Id);
continent.where(ContinentDao.Properties.Name.eq("Europe"));
List<City> bigEuropeanCities = qb.list();



//自连接
QueryBuilder<Person> qb = personDao.queryBuilder();
Join father = qb.join(Person.class, Properties.FatherId);
Join grandfather = qb.join(father, Properties.FatherId, Person.class, Properties.Id);
grandfather.where(Properties.Name.eq("Lincoln"));
List<Person> lincolnDescendants = qb.list();

```

## 一对一，一对多，多对多

-------------------------------------------------------------------

```java

@toOne(joinProperty = "id")	
// 	joinProperty指明字段名，指向另一个实体的主键
//	get方法获得的实体是Lazy的

Customer customerA = user.getCustomer();
 
// change the customer id	
user.setCustomerId(customerIdB);		//之后getCustemer()是更新后的
// or set a customer with a different id
user.setCustomer(customerB);			//customerId会得到更新
 
customerB = user.getCustomer();
assert(customerA.getId() != customerB.getId());

// loadDeep() 和 queryDeep() 方法可以立刻而非lazy的方式获得实体


@toMany 
	//应用于List中
@ToMany(referencedJoinProperty = "customerId")
@OrderBy("date ASC")
	//customerId作为目标实体外键 指向 本实体的 主键
	
@ToMany(joinProperties = {
        @JoinProperty(name = "tag", referencedName = "customerTag")
})
@OrderBy("date ASC")
	//本实体的 tag 和 目标实体的customerTag 的对多关系
	
	
@ToMany
@JoinEntity(
        entity = JoinProductsWithOrders.class,
        sourceProperty = "productId",
        targetProperty = "orderId"
)
	// 多对多的关系，并建立中间表 JoinProductsWithOrders.class
	// 本实体主键 对应 中间表 sourceProperty
	// 目标实体主键 对应 中间表 targetProperty
//例子如下
@Entity
public class Product {
    @Id private Long id;

    @ToMany
    @JoinEntity(
            entity = JoinProductsWithOrders.class,
            sourceProperty = "productId",
            targetProperty = "orderId"
    )
    private List<Order> ordersWithThisProduct;
}

@Entity
public class JoinProductsWithOrders {
    @Id private Long id;
    private Long productId;
    private Long orderId;
}

@Entity
public class Order {
    @Id private Long id;
}


// @ToMany 的get方法会进行缓存，随后的get方法不会查询数据库

	
```

## 更新 @ToMany 关系

-------------------------------------------------------------

```java

// 由于缓存的存在 增加删除 时需要同时对 缓存列表进行 增加删除
List<Order> orders = customer.getOrders();
// remove one of the orders from the database
daoSession.delete(someOrder);
// manually remove it from the to-many list
orders.remove(someOrder);


// reset系列方法和清空 @ToMany 的缓存
customer.resetOrders();
List<Order> orders = customer.getOrders();

```

## 双向 一对多 关系

------------------------------------------------------------

```java

@Entity
public class Customer {
    @Id private Long id;
 
    @ToMany(referencedJoinProperty = "customerId")
    @OrderBy("date ASC")
    private List<Order> orders;
}
 
@Entity
public class Order {
    @Id private Long id;
    private Date date;
    private long customerId;
 
    @ToOne(joinProperty = "customerId")
    private Customer customer;
}

```

## 建立 树形 关系 (Modelling Tree Relations)

----------------------------------------------------------------

```java

@Entity
public class TreeNode {
    @Id private Long id;
 
    private Long parentId;
 
    @ToOne(joinProperty = "parentId")
    private TreeNode parent;
 
    @ToMany(referencedJoinProperty = "parentId")
    private List<TreeNode> children;
}

```
