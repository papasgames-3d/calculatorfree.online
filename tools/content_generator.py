import os
from datetime import datetime
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT, 'content')


def generate_calculator_content(calculator_type, base_description):
    current_month = datetime.now().strftime("%B %Y")

    content = {
        "title": f"{calculator_type} - Free Online Calculator | Updated {current_month}",
        "meta_description": f"Free online {calculator_type.lower()} with step-by-step calculations. {base_description} Updated for {current_month}.",
        "h1": calculator_type,
        "intro": f"""Our free online {calculator_type.lower()} provides quick and accurate results. 
Updated for {current_month}, this calculator helps you {base_description.lower()}""",
        "features": [
            "Easy to use interface",
            "Mobile-friendly design",
            "Instant calculations",
            "Step-by-step explanations",
            "No registration required",
            "100% free to use"
        ],
        "how_to_use": [
            "Enter your values in the input fields",
            "Click the calculate button",
            "Review your results",
            "Use the detailed breakdown for more information"
        ],
        "example_calculations": generate_examples(calculator_type),
        "last_updated": datetime.now().strftime("%Y-%m-%d")
    }

    return content


def generate_examples(calculator_type):
    examples = {
        "Mortgage Calculator": [
            {"inputs": {"home_price": "$300,000", "down_payment": "$60,000", "interest": "3.5%", "term": "30 years"},
             "result": "$1,077 monthly payment"},
            {"inputs": {"home_price": "$500,000", "down_payment": "$100,000", "interest": "4.0%", "term": "15 years"},
             "result": "$2,959 monthly payment"}
        ],
        "BMI Calculator": [
            {"inputs": {"weight": "70 kg", "height": "170 cm"},
             "result": "BMI: 24.2 (Normal weight)"},
            {"inputs": {"weight": "150 lbs", "height": "5'8\""},
             "result": "BMI: 22.8 (Normal weight)"}
        ]
    }

    return examples.get(calculator_type, [
        {"inputs": {"value1": "Example input 1", "value2": "Example input 2"},
         "result": "Example result"}
    ])


def update_calculator_content(html_file):
    calculator_type = " ".join(html_file.replace('.html', '').split('-')).title()

    descriptions = {
        "Mortgage Calculator": "Calculate monthly mortgage payments, interest, and amortization schedule.",
        "BMI Calculator": "Calculate your Body Mass Index and check your weight category.",
        "Loan Calculator": "Calculate loan payments, interest, and total cost of borrowing.",
        "Investment Calculator": "Calculate investment returns, compound interest, and growth projections."
    }

    base_description = descriptions.get(calculator_type, "Calculate accurate results quickly and easily.")
    content = generate_calculator_content(calculator_type, base_description)

    os.makedirs(CONTENT_DIR, exist_ok=True)
    json_file = os.path.join(CONTENT_DIR, html_file.replace('.html', '_content.json'))
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2)

    print(f"Generated fresh content for {html_file}")
    print(f"Content saved to {json_file}")
    return content


def main():
    html_files = [
        f for f in os.listdir(ROOT)
        if f.endswith('.html') and 'calculator' in f
    ]

    for html_file in html_files:
        print(f"\nProcessing {html_file}...")
        update_calculator_content(html_file)
        print("Content updated successfully!")


if __name__ == "__main__":
    main()
