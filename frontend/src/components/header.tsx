import { useState } from 'react';

import { Link } from 'react-router-dom';
import { Burger, Container, Group, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from './Logo.png';
import classes from './styles/header.module.css';
import { useAuth } from 'react-oidc-context';
import LogButton from './logbutton';



function Header() {
    const auth = useAuth();

    let links = [
        { link: '/', label: 'Home' },
        { link: '/workout', label: 'Workout' },
        { link: '/contact', label: 'Contact' },
    ];
    
    
    if (!auth.isLoading && auth.isAuthenticated && auth.user?.profile.name) {
    
        links = [...links, { link: `/user/${auth.user?.profile.name}`, label: auth.user.profile.name }]
    
    }
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (

        <Link
            key={link.label}
            to={link.link} 
            className={classes.link}
            data-active={active === link.link || undefined}
            onClick={() => setActive(link.link)} 
        >
            {link.label}
        </Link>

    ));

    return (
    <header className={classes.header}>
        <Container size="100%" className={classes.inner}>
            <div className={classes.logo}>    
                <Image src={Logo} alt="HoopLab Logo" width="auto" height="150" fit="contain"/>
            </div>
            <Group gap={20} visibleFrom="xs" className={classes.navItems}>
                {items}
            </Group>
            <LogButton />

            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Container>
    </header>
    );
}

export default Header;