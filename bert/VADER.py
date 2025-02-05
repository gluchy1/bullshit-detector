from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd

# https://www.foxnews.com/politics/trump-agrees-pause-tariffs-canada-exchange-more-border-enforcement
sentences = [
    "Trump agrees to pause tariffs on Canada in exchange for more border enforcement.",
    "President Donald Trump will pause additional tariffs on Canadian imports for 30 days after a call with Prime Minister Justin Trudeau, who made some concessions to temporarily stave off the levies.",
    "Trump and Trudeau spoke via phone on Monday, hours before additional 25% tariffs were to take effect on Canadian goods coming into the United States.",
    "In a post on X, Trudeau said Canada will implement a $1.3 billion border plan and appoint a fentanyl czar.",
    "In addition, Canada will reinforce its border with new helicopters, technology, personnel and enhanced coordination with American authorities.",
    "He added that nearly 10,000 personnel are and will be working on border protection.",
    "Trump defends tariffs, accuses Canada of being 'very abusive of the United States.'",
    "President Donald Trump talks with Canadian Prime Minister Justin Trudeau during the plenary session of the NATO summit in London on Dec. 4, 2019.",
    "We will list cartels as terrorists, ensure 24/7 eyes on the border, launch a Canada-U.S. Joint Strike Force to combat organized crime, fentanyl and money laundering, Trudeau wrote.",
    "I have also signed a new intelligence directive on organized crime and fentanyl and we will be backing it with $200 million.",
    "Proposed tariffs will be paused for at least 30 days while we work together, he added.",
    "Trump has long said Canada and Mexico have failed to do enough to prevent the flow of illegal migrants and drugs, particularly fentanyl, from those nations into the U.S.",
    "In addition, Trump claims the U.S. has subsidized Canada to the tune of $200 billion annually.",
    "Overdose epidemic: Bipartisan senators target fentanyl classification as lapse approaches.",
    "These bags of fentanyl were seized in Nogales, Arizona, in October 2022.",
    "We need to protect Americans, and it is my duty as President to ensure the safety of all, Trump wrote in a statement on Saturday, when he imposed the tariffs.",
    "I made a promise on my campaign to stop the flood of illegal aliens and drugs from pouring across our Borders, and Americans overwhelmingly voted in favor of it.",
    "Hours before his call with Trudeau, Mexican President Claudia Sheinbaum said she would deploy 10,000 troops to the U.S.-Mexico border over tariff threats.",
    "Trump has promised to impose a 25% tariff on all Canadian and Mexican goods, as well as a 10% tariff on Canadian energy and a 10% tariff on all goods entering the U.S. from China.",
    "The tariffs on Canada and China were set to go into effect Tuesday at midnight.",
    "Trucks drive across the Blue Water Bridge at the border crossing between the U.S. and Point Edward in Ontario, Canada, on Feb. 3, 2025.",
    "Threats prompted leaders in multiple Canadian provinces to pledge to remove American alcohol from store shelves."
]


analyzer = SentimentIntensityAnalyzer()

data = []

for sentence in sentences:
    scores = analyzer.polarity_scores(sentence)
    scores["sentence"] = sentence  # Store original sentence for reference
    data.append(scores)

df = pd.DataFrame(data)

# import ace_tools as tools
# tools.display_dataframe_to_user(name="Sentiment Analysis Results", dataframe=df)

avg_scores = df[["neg", "neu", "pos", "compound"]].mean()
print("\nAverage Polarity Scores:")
print(avg_scores)
