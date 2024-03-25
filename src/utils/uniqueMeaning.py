import json
import openai


# DO NOT COMMIT OR PUSH THIS KEY TO THE REPO. REPLACE IT WITH JUNK BEFORE COMMITING OR PUSHING
openai.api_key = "Hiiiiii"


characters = []
charactersJSON = json.load(open("meanings.json"))
n = len(charactersJSON)
i = 0
    
with open("singleMeanings.json", "w") as outfile:
    while(i < n):
        charList = []
        for j in range(50):
            # print(character)
            character = charactersJSON[i]
            charList.append(character)
            i += 1
            # # This is the chatgpt prompt
            if(i >= n):
                break

        messages=[{"role": "user", "content": "I am going to send you fifty JSON objects that map Kanji to a list of its possible English meanings. This is an example of an object you'll be sent: {'kanji': '麗', 'meanings': ['lovely', 'beautiful', 'graceful', 'resplendent']}. I want you to pick the single most common or relevant meaning from the list of meanings. Do not add meanings beyond those present in the list. Return a corresponding list of JSON objects formatted as follows: {\"unicode\": \"(kanji here)\", \"one_word_meaning\": \"(meaning of your choice)\"}. You should only edit the response sections (kanji here), which is the 'kanji' field from the original object, and the field 'meaning of your choice', which is the single most common meaning of the kanji. Only return the list of JSON objects you construct; do not return anything else with your response. Make sure you enclose field and value names in double quotes. Here are the objects: " + str(json.dumps(charList))}]
        # messages.append({"role": "user", "content": str(character)})

        print()
        print("sending message, i = " + str(i))
        print()

        chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

        print(*json.loads(chat_completion.get("choices")[0].get("message").get("content")))
        
        characters.append(json.loads(chat_completion.get("choices")[0].get("message").get("content")))
        for obj in json.loads(chat_completion.get("choices")[0].get("message").get("content")):
            json.dump(obj, outfile)
            outfile.write(",")

        print("characters appended")

        # print(characters)

with open("singleMeaningsBackup.json", "w") as outfile:
    json.dump(characters, outfile)




