import csv
import os
import hashlib
import base64
from pathlib import Path

def generate_ssha_password(password: str) -> str:
    """Generates an SSHA hashed password."""
    salt = os.urandom(4)
    sha = hashlib.sha1(password.encode('utf-8'))
    sha.update(salt)
    return '{SSHA}' + base64.b64encode(sha.digest() + salt).decode('utf-8')

def convert_csv_to_ldif(csv_file: Path, ldif_file: Path, default_password="123", samba_sid=None):
    multi_valued_fields = {"objectClass", "memberOf", "dSCorePropagationData"}
    attributes = {}

    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            key = row['attribute'].strip()
            value = row['value'].strip()
            allowed_keys = {
                "dn", "distinguishedName", "objectClass", "cn", "sn", "givenName", "displayName",
                "memberOf", "sAMAccountName"
            }
            if key in allowed_keys:
                if key in multi_valued_fields:
                    attributes.setdefault(key, []).append(value)
                else:
                    attributes[key] = value

    dn = attributes.pop('distinguishedName', None)
    if not dn:
        raise ValueError(f"'distinguishedName' is missing in {csv_file.name}")

    # Add extra LDAP attributes
    attributes.setdefault('objectClass', []).extend([
        'inetOrgPerson',
        'sambaSamAccount'
    ])
    attributes['objectClass'] = list(set(attributes.get('objectClass', [])) & {
        'top', 'person', 'organizationalPerson', 'inetOrgPerson', 'sambaSamAccount'
    })
    attributes['userPassword'] = generate_ssha_password(default_password)
    if samba_sid:
        attributes['sambaSID'] = samba_sid

    with open(ldif_file, 'w', encoding='utf-8') as ldif:
        ldif.write(f"dn: {dn}\n")
        allowed_output_keys = {
            "dn", "objectClass", "cn", "sn", "givenName", "displayName",
            "memberOf", "sAMAccountName", "userPassword", "sambaSID"
        }
        if "sn" not in attributes:
            attributes["sn"] = attributes.get("cn", "").split()[-1]

        for key, value in attributes.items():
            if key not in allowed_output_keys:
                continue
            if isinstance(value, list):
                for item in value:
                    ldif.write(f"{key}: {item}\n")
            else:
                ldif.write(f"{key}: {value}\n")

def process_all_users(base_dir="csv/users", output_dir="ldif"):
    categories = ["personnel", "regular", "system"]
    for category in categories:
        user_dir = Path(base_dir) / category
        for csv_file in user_dir.glob("*.csv"):
            name = csv_file.stem
            ldif_file = Path(output_dir) / f"20-{name}.ldif"
            samba_sid = f"S-1-5-21-3623811015-3361044348-30300820-{1000 + hash(name) % 1000}"
            convert_csv_to_ldif(csv_file, ldif_file, samba_sid=samba_sid)
            print(f"✅ Converted {csv_file} → {ldif_file}")

if __name__ == "__main__":
    process_all_users()
