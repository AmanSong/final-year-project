import { React, useEffect, useState } from "react"
import { CForm, CFormTextarea, CFormRange, CFormInput } from "@coreui/react";
import Genre from "./Genre";
import axios from "axios";
import './StoryGeneration.css';
import TextSettings from "./TextSettings";

function StoryGeneration({ generate_story, onGenerateStoryComplete, onUpdateGeneratedStory }) {

  const [storyInput, setStoryInput] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [genres, setGenres] = useState([]);
  const [amount, setAmount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontName, setFontName] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(15);

  const handleGenre = (selectedGenres) => {
    setGenres(selectedGenres);
  }

  const handleTextSettings = (fontname, fontsize) => {
    setFontName(fontname);
    setFontSize(fontsize);
  }

  // when user clicks generate, call api endpoint to generate
  useEffect(() => {
    if (generate_story && !isGenerating) {

      if(storyInput == '' || storyTitle == ''){
        alert('Please provide some context and a title!');
        setIsGenerating(false);
        onGenerateStoryComplete();
        return;
      }

      setIsGenerating(true);

      // call endpoint
      const generateStory = async (storyInput, storyTitle, genres, amount, fontName, fontSize) => {
        try {
          const response = await axios.post("http://127.0.0.1:8000/story", {
            story_prompt: storyInput,
            story_title: storyTitle,
            genres: genres,
            amount: amount
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            //responseType: 'arraybuffer'
          });

          console.log(response);

          // generate images from the summaries
          let len = response.data.storyPrompts.length;
          let prompts = response.data.storyPrompts;
          let storyGenerated = response.data.generatedStory

          let images = await generateImages(prompts, len);

          console.log(images)
          console.log(len)
          console.log(prompts)

          const response2 = await axios.post("http://127.0.0.1:8000/storyToPDF", {
            story: storyGenerated,
            story_title: storyTitle,
            story_images: images,
            font_name: fontName,
            font_size: fontSize
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer'
          });

          // Callback to pass the updated GeneratedStory to the parent component
          const GeneratedStory = response2.data;
          onUpdateGeneratedStory({ generatedStory: GeneratedStory, Title: storyTitle });

          setIsGenerating(false);
          onGenerateStoryComplete();
        } catch (error) {
          console.error("Error sending data:", error);
          setIsGenerating(false);
          onGenerateStoryComplete();
        }
      }
      generateStory(storyInput, storyTitle, genres, amount, fontName, fontSize);

    }
  }, [generate_story, isGenerating, onGenerateStoryComplete]);

  // api to generate images
  const generate = async (prompt) => {
    try {
      const result = await axios.post(`http://127.0.0.1:8000/?prompt=${prompt}`);
      console.log(result)
      return result.data;
    } catch (error) {
      console.error("Something went wrong: ", error);
      return null;
    }
  };

  // function to generate images for each page
  const generateImages = async (storyPrompts, len) => {
    try {
      const newAiImages = [];
      for (let i = 0; i < len; i++) {
        let prompt = storyPrompts[i];

        console.log(prompt)
        console.log('generating images', i);

        if (prompt !== '') {
          const image = await generate(prompt);
          if (image === null || image.includes('Error generating image')) {
            alert('An error occured while generating an image');
            continue;
          }
          console.log("Generated image:");
          newAiImages.push(image);
        }
      }
      return newAiImages;

    } catch (error) {
      console.error("Error in generateImages:", error);
    }
  }

  return (
    <div>

      <div className="storyTitleDiv">
        <CFormInput
          className="storyTitleInput"
          type="text"
          placeholder="Title of Story"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)} />
      </div>

      <CForm className="form-input">
        <CFormTextarea
          className="context-input"
          id="story-input"
          label="Give some context"
          placeholder="A hero needs to defeat an evil dragon..."
          rows={5}
          value={storyInput}
          onChange={(e) => setStoryInput(e.target.value)}
        />
      </CForm>

      <div className="page-amount-selection">
        <h6>Average Pages</h6>
        <CFormRange onChange={(event) => setAmount(event.target.value)} className="range-selector" min={1} max={10} label={amount} defaultValue="1" />
      </div>

      <div className="select-container">
        <Genre onGenresSelected={handleGenre}></Genre>
      </div>

      <div className="select-container">
        <TextSettings onTextSettings={handleTextSettings}></TextSettings>
      </div>

    </div>
  );
}

export default StoryGeneration;