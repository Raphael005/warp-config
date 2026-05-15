from models import Pet, NewPet, Status

# Test Pet instantiation
pet = Pet(id=1, name="Fido", tag="dog", status=Status.available)
print(f"Pet: {pet}")

# Test NewPet instantiation
new_pet = NewPet(name="Whiskers", status=Status.pending)
print(f"NewPet: {new_pet}")

# Test optional fields default to None
minimal_pet = Pet(id=2, name="Birdie")
assert minimal_pet.tag is None
assert minimal_pet.status is None
print(f"Minimal Pet: {minimal_pet}")

# Test enum values
assert pet.status == Status.available
assert new_pet.status == Status.pending
print("All assertions passed.")
