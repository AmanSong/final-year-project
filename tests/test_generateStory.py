import sys
from os import path
import pytest
import get_path

sys.path.append(path.join(path.dirname(__file__), "../backend"))

from backend.generateStory import story_generator

context = 'A simple story of a wizard'
title = 'Wizard Lore'
genres = ['Fantasy']
amount = 1

def test_generate_story():
    print('Testing in process')
    result, prompts = story_generator(context, title, genres, amount)
    print(result)
    assert len(result) > 0, "There is a story in the list"
    assert len(prompts) > 0, "There is prompts in the list"


if __name__ == "__main__":
    pytest.main(["-v", __file__])