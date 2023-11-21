from transformers import GPT2LMHeadModel, GPT2Tokenizer, set_seed
import torch

# Assuming you have already loaded the model and tokenizer
models_dir = "models"
model_name = "gpt2"

# load tokenizer and model from GPT2
tokenizer = GPT2Tokenizer.from_pretrained(model_name, cache_dir=models_dir)
model = GPT2LMHeadModel.from_pretrained(model_name, cache_dir=models_dir, pad_token_id=tokenizer.eos_token_id)

# Set the seed for reproducibility
set_seed(42)

# check if cuda (GPU) is available, else use CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generateStory(input_prompt):
    prompt = input_prompt

    # Tokenize the prompt using tokenizer
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate text with the model using tokenized prompt, how long to generate
    output = model.generate(input_ids, max_length=100, num_beams=5, num_return_sequences=1, no_repeat_ngram_size=2)

    # Decode the generated output
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    # Print the generated story
    return generated_text


