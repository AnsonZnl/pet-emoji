1、做好分页，一页8个，目前获取每个分类列表总数有误[x]

2、用户上传的图片请上传到cloudflare上 /pet-emoji/user-upload目录下，和pet-emoji/emoji-packs/平级，最后使用图片的URL给大模型（而不是现在使用base64），参考：https://www.volcengine.com/docs/82379/1541523，全链路都不使用base64.
2.1、数据表里增加一个字段，字段为用户上传的图片，值时用户的图片url

3、限制触发时提示使用一个第三方UI toast库、或者自己封装一个toast组件库去使用，而不是现在这样使用alert，这样很不友好。[x]
3.1、在How It Works模块增加为什么增加限制，以及用户什么时间来使用的提示，内容大意：目前为了控制成本，做了频率限制，一小时一次（英文）
