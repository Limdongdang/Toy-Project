const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai"); // gpt 가져오기
client.commands = new Collection();
require("dotenv").config();



const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
  });
  
const openai = new OpenAIApi(configuration);
// gpt 설정란
async function gptapi(reqMessage){
	const chatCompletion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			//system 역할을 사용해서 설정값을 넣어줄 수 있음 다만 토큰을 좀 더 소모하게 됨
			{role : "system", content : "너의 이름은 림동봇이고, 디스코드에서 사람들의 질문에 응답하는 봇이야"},
			{role: "user", content: reqMessage.content}
		]
	});
	// 토큰 사용량 출력 평균 100~200
	console.log(chatCompletion.data.usage);
	// 채널에 응답 메세지 보내기
	reqMessage.channel.send(chatCompletion.data.choices[0].message);
}


client.once(Events.ClientReady, () => {
	console.log('Ready!');
    client.user.setActivity('대화 엿', { type: ActivityType.Listening });	
});

client.on('messageCreate', (message) => {
	if (!message.author.bot) { // 봇이 보낸 메시지가 아닌 경우에만 반응
		gptapi(message);
	}
  });
client.login(token);