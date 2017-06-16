# チャットボット Web版

Bluemix の CFアプリ または Bluemix IaaS で動作するWeb版 チャットボットです。 Watson NLC を利用して受信メッセージをクラス分類して、適切なメッセージを返す振る舞いをします。

Bluemix の Watson NLC と Cloudant のサービスと接続する方法は、Qiitの[Watson チャットボットの作り方 第３回目](http://qiita.com/MahoTakara/private/28dee5ed8d4e02e5ab04)を参照ねがいます。また、NLCのトレーニングデータと応答用のデータ、及び、ツールは https://github.com/takara9/chatbot-corpus にあります。


## Bluemix の場合

~~~
cp index.html.bluemix index.html
bx cf push
~~~


## Local環境の場合

~~~
cp index.html.local index.html
npm install
npm start
~~~

