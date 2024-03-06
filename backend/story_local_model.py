from transformers import GPT2LMHeadModel, GPT2Tokenizer, set_seed
import torch

# the name of the model and directory
models_dir = "models"
model_name = "gpt2"

# load tokenizer and model from GPT2
tokenizer = GPT2Tokenizer.from_pretrained(model_name, cache_dir=models_dir)
model = GPT2LMHeadModel.from_pretrained(model_name, cache_dir=models_dir, pad_token_id=tokenizer.eos_token_id)

# Set the seed
set_seed(42)

# check if cuda (GPU) is available, else use CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generateStory(input_prompt):
    print(input_prompt)
    prompt = input_prompt

    # Tokenize the prompt using tokenizer
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

    # Generate text with the model using tokenized prompt, 
    # the parameters seems to be the best
    generated_text = model.generate(
                                input_ids,
                                do_sample = True, 
                                max_length = 300,
                                #temperature = 0.8,
                                top_k = 50, 
                                top_p = 0.85,
                                #num_return_sequences=1
    )

    # decode the text and return it
    decoded_text = [tokenizer.decode(sequence, skip_special_tokens=True) for sequence in generated_text]

    return decoded_text