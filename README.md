# Railway Booking

Screenshot
--

**火車班次查詢系統**
![](https://i.imgur.com/yMH3K1I.gif)

**班次詳細資料**
![](https://i.imgur.com/IINSnHi.png)

**訂票成功頁面**
![](https://i.imgur.com/QUtTQR1.png)

**火車查詢車票系統**
![](https://i.imgur.com/zGbbYLF.png)

How to build
---
1. 首先，透過下面連結內的指令先將資料庫建起來。
https://gist.github.com/benebsiny/00217e389b811ebb8e6c1733708ca7d1
2. clone專案下來：
```SHELL=
git clone https://github.com/benebsiny/Railway-Booking.git
```
3. 進入專案資料夾，先產生python的虛擬環境：

* Linux使用者需要先安裝相關套件，才能產生虛擬環境(python版本必須>3.6)
```SHELL=
cd Railway-Booking
sudo apt install python3.8-venv
python3.8 -m venv venv
```
* Windows使用者直接產生虛擬環境
```SHELL=
cd Railway-Booking
python -m venv venv
```


4. 進入python虛擬環境，三種不同的環境有三種不同的指令，請選擇自己的環境來輸入指令：
* **Linux**
```SHELL=
source ./venv/bin/activate
```
* **Windows的CMD**
```SHELL=
.\venv\Scripts\activate.bat 
```
* **Windows的PowerShell**
```SHELL=
 .\venv\Scripts\activate.ps1
```
5. 進來虛擬環境後，安裝必要的python套件：
```SHELL=
pip install -r requirements.txt
```
6. 新建`.env`檔案（env前面要有個點），裡面包含4個東西（大括號記得替換掉）：
```
DB_USER={你的資料庫帳號，通常是root}
DB_PASSWORD={你的資料庫密碼}
DB_HOST=localhost
DB_PORT=3306
```
7. 下面這行指令是讓你mysql的資料庫裡面的table (schema)轉成django的class (schema)，**這步不用做**，因爲已經做好了。
```shell=
python manage.py inspectdb > booking/models.py
```
8. 實例化schema（這裡的schema是django的，不是mysql的，換句話說，mysql有mysql看得懂的schema，django有django看得懂的schema，上面那行指令就是把mysql看得懂的schema變成django看得懂的schema，這行指令就是實例化這個schema）
```shell=
python manage.py migrate
```
這個時候，你可以到mysql那邊看看你的database，會發現多了幾個跟django相關的table哦。

9. Run起你的伺服器
```shell=
python manage.py runserver
```


10. 建立超級使用者，如此可以透過網頁來管理你的資料庫
```shell=
python manage.py createsuperuser
```
依序填入使用者帳號、電子郵件、使用者密碼。

11. 進入django後端管理程式 http://127.0.0.1:8000/admin ，登入，就可以看到一些管理網站的設定與資料庫，在裡面增/刪/改資料皆會動到mysql裡的資料。

---

開始輸入資料
---

### station
https://gist.github.com/benebsiny/dabc2ab8c852a026bef75280352318ea

### train
https://gist.github.com/benebsiny/845b491050f75837007d4ff3da5186b8

### stop_at
https://gist.github.com/benebsiny/0fd3a7cdd0a8241d018f24980c9e9fd3