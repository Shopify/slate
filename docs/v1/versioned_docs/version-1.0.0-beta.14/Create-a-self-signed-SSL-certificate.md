
---
id: version-1.0.0-beta.14-create-a-self-signed-ssl-certificate
title: Create a self-signed SSL certificate
original_id: create-a-self-signed-ssl-certificate
---

Slate uses a local Express server to serve your assets locally. It's a good idea to create a trusted, self-signed SSL certificate on your device so the assets, served via `https`, are never blocked.

1. Run the following commands to install [mkcert](https://github.com/FiloSottile/mkcert). See the [installation docs](https://github.com/FiloSottile/mkcert#installation) for more details.

```bash
brew install mkcert
```

2. Copy and paste the bash function into your terminal (or into your `.bashrc` file if you want to have it available in the future):

### Mac
```bash
function ssl-check() {
    f=~/.localhost_ssl;
    ssl_crt=$f/server.crt
    ssl_key=$f/server.key
    b=$(tput bold)
    c=$(tput sgr0)

    # local_ip=$(ip route get 8.8.4.4 | head -1 | awk '{print $7}') # Linux Version
    local_ip=$(ipconfig getifaddr $(route get default | grep interface | awk '{print $2}')) # Mac Version
    # local_ip=999.999.999 # (uncomment for testing)

    domains=(
        "localhost"
        "$local_ip"
    )

    if [[ ! -f $ssl_crt ]]; then
        echo -e "\n🛑  ${b}Couldn't find a Slate SSL certificate:${c}"
        make_key=true
    elif [[ ! $(openssl x509 -noout -text -in $ssl_crt | grep $local_ip) ]]; then
        echo -e "\n🛑  ${b}Your IP Address has changed:${c}"
        make_key=true
    else
        echo -e "\n✅  ${b}Your IP address is still the same.${c}"
    fi

    if [[ $make_key == true ]]; then
        echo -e "Generating a new Slate SSL certificate...\n"
        count=$(( ${#domains[@]} - 1))
        mkcert ${domains[@]}

        # Create Slate's default certificate directory, if it doesn't exist
        test ! -d $f && mkdir $f

        # It appears mkcert bases its filenames off the number of domains passed after the first one.
        # This script predicts that filename, so it can copy it to Slate's default location.
        if [[ $count = 0 ]]; then
            mv ./localhost.pem $ssl_crt
            mv ./localhost-key.pem $ssl_key
        else
            mv ./localhost+$count.pem $ssl_crt
            mv ./localhost+$count-key.pem $ssl_key
        fi
    fi
}
```

### Linux/Ubuntu
```
function ssl-check() {
         f=~/.localhost_ssl;
         ssl_crt=$f/server.crt
         ssl_key=$f/server.key
         b=$(tput bold)
         c=$(tput sgr0)

         local_ip=$(hostname -I | cut -d' ' -f1)
         # local_ip=999.999.999 # (uncomment for testing)

         domains=(
             "localhost"
             "$local_ip"
         )

         if [[ ! -f $ssl_crt ]]; then
             echo -e "\n🛑  ${b}Couldn't find a Slate SSL certificate:${c}"
             make_key=true
         elif [[ ! $(openssl x509 -noout -text -in $ssl_crt | grep $local_ip) ]]; then
             echo -e "\n🛑  ${b}Your IP Address has changed:${c}"
             make_key=true
         else
             echo -e "\n✅  ${b}Your IP address is still the same.${c}"
         fi

         if [[ $make_key == true ]]; then
             echo -e "Generating a new Slate SSL certificate...\n"
             count=$(( ${#domains[@]} - 1))
             mkcert ${domains[@]}

             # Create Slate's default certificate directory, if it doesn't exist
             test ! -d $f && mkdir $f

             # It appears mkcert bases its filenames off the number of domains passed after the first one.
             # This script predicts that filename, so it can copy it to Slate's default location.
             if [[ $count = 0 ]]; then
                 mv ./localhost.pem $ssl_crt
                 mv ./localhost-key.pem $ssl_key
             else
                 mv ./localhost+$count.pem $ssl_crt
                 mv ./localhost+$count-key.pem $ssl_key
             fi
         fi
     }
```

3. Run the function you just declared in step 2:

```bash
ssl-check
```

4. You now have successfully created a local, self-signed SSL certificate for developing with Slate!

## Common mistakes

Even after performing the above steps, you might encounter the following errors and warnings when developing with Slate:

<table class="image">
<caption align="bottom"><em>An example of https requests to your local asset server being blocked</em></caption>
<tr><td><img src="https://user-images.githubusercontent.com/4837696/46975905-d8c08400-d095-11e8-933e-d07af7212a49.png" alt="An example of https requests to your local asset server being blocked"/></td></tr>
</table>

<table class="image">
<caption align="bottom"><em>An example of Chrome warning you of an untrusted https certificate</em></caption>
<tr><td><img src="https://user-images.githubusercontent.com/4837696/46975769-81221880-d095-11e8-992d-ff0f0fe08bb9.png" alt="An example of Chrome warning you of an untrusted https certificate"/></td></tr>
</table>

This is most likely because your local IP has changed and the self-signed SSL certificate you created is no longer valid. To remove these warnings and errors, simply repeat steps 2 and 3 above to regenerate a new self-signed certificate.
