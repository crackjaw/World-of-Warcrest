#!/usr/bin/env python3
import asyncio
import os
import sys
from decouple import config, UndefinedValueError

# Load Google Antigravity SDK
try:
    from google.antigravity import Agent, LocalAgentConfig
except ImportError:
    print("Error: The google-antigravity SDK is not installed in the active environment.")
    print("Please run './setup_env.sh' and activate the virtual environment:")
    print("  source .venv/bin/activate")
    sys.exit(1)

# Helper to check/load Gemini API Key
def get_api_key():
    # First, check environmental variable or .env file via python-decouple
    try:
        api_key = config("GEMINI_API_KEY")
        if api_key:
            return api_key
    except UndefinedValueError:
        pass
    
    # Second, check OS environment fallback
    return os.environ.get("GEMINI_API_KEY")

async def run_demo():
    api_key = get_api_key()
    
    print("====================================================")
    print("   🌌  World of Warcrest - Antigravity 2.0 Agent  🌌  ")
    print("====================================================")
    
    if not api_key:
        print("\n[!] WARNING: GEMINI_API_KEY not found in environment or .env file.")
        print("To interact with the Antigravity agent, you need a Gemini API Key.")
        print("1. Get your free key at: https://aistudio.google.com/app/api-keys")
        print("2. Set it in your terminal:")
        print("   export GEMINI_API_KEY=\"your_key_here\"")
        print("   OR create a '.env' file in this folder:")
        print("   echo 'GEMINI_API_KEY=\"your_key_here\"' > .env\n")
        
        # We can still run the script configuration checks to prove the code compiles
        print("Performing dry-run configuration check...")
        try:
            LocalAgentConfig()
            print("[✓] SDK Configuration initialized successfully (LocalAgentConfig validation passed).")
        except Exception as e:
            print(f"[✗] Configuration error: {e}")
        return

    print("\n[✓] GEMINI_API_KEY found.")
    print("Connecting to Antigravity Agent using gemini-3.5-flash...")
    
    # Initialize Agent Configuration
    config_obj = LocalAgentConfig(
        api_key=api_key,
        system_instructions="You are an expert game master for 'World of Warcrest', an epic text-based fantasy RPG. Respond in a highly engaging, immersive, and premium style."
    )
    
    try:
        async with Agent(config=config_obj) as agent:
            print("\n--- Starting Conversation ---")
            print("GM: Welcome, adventurer, to the World of Warcrest. What is your name and class?\n")
            
            # Send initial prompt
            response = await agent.chat("Let's start the text adventure. Introduce the starter town of CrestHaven.")
            
            # Stream the agent's thoughts
            print("Thoughts:")
            async for thought in response.thoughts:
                print(thought, end="", flush=True)
            print("\n")
            
            # Stream the final response
            print("Response:")
            async for token in response:
                print(token, end="", flush=True)
            print("\n")
            
            print("-----------------------------")
            print("[✓] Session completed successfully.")
            
    except Exception as e:
        print(f"\n[✗] An error occurred during execution: {e}")
        print("Please double check that your API key is valid and has access.")

if __name__ == "__main__":
    try:
        asyncio.run(run_demo())
    except KeyboardInterrupt:
        print("\nExiting interactive agent session.")
