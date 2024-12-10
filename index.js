require('dotenv').config(); // .env 파일 로드
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

console.log("TOKEN:", process.env.TOKEN || "TOKEN 값이 없습니다.");
console.log("ROLE_ID:", process.env.ROLE_ID || "ROLE_ID 값이 없습니다.");
console.log("CHANNEL_ID:", process.env.CHANNEL_ID || "CHANNEL_ID 값이 없습니다.");

const TOKEN = process.env.TOKEN; // 환경 변수에서 봇 토큰 읽기
const ROLE_ID = process.env.ROLE_ID; // 환경 변수에서 역할 ID 읽기
const CHANNEL_ID = process.env.CHANNEL_ID; // 환경 변수에서 채널 ID 읽기

client.on('ready', () => {
    console.log(`${client.user.tag}로 로그인되었습니다!`);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const role = newMember.guild.roles.cache.get(ROLE_ID);
    const channel = newMember.guild.channels.cache.get(CHANNEL_ID);

    if (!oldMember.roles.cache.has(ROLE_ID) && newMember.roles.cache.has(ROLE_ID)) {
        console.log("역할이 부여되었습니다!");

        if (!channel) {
            console.error("채널을 찾을 수 없습니다.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`⚔️ Brave adventurer ${newMember.user.username} has bestowed their mystical boost upon our realm!`)
            .setDescription(
                "The dungeon corridors now shimmer faintly with your magic, lighting our path through the darkness.\n\n" +
                "All explorers stand in awe of your valor and steadfast spirit!"
            )
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: "Thank you for your support!", iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        // 메시지 전송 및 이모티콘 반응 추가
                channel.send({
                    content: `🎉 ${newMember}`, // @멘션
                    embeds: [embed] // 임베드 메시지
                })
                    .then(message => {
                        console.log("임베드 메시지가 성공적으로 전송되었습니다!");
                        // 자동으로 이모티콘 반응 추가
                        message.react('🎉'); // 🎉 이모티콘 반응
                        message.react('✨'); // ✨ 이모티콘 반응
                    })
                    .catch(err => console.error("임베드 메시지 전송 실패:", err));
            } else {
                console.log("역할 변경 이벤트가 감지되었지만 조건에 맞지 않습니다.");
            }
        });

        client.login(TOKEN);
