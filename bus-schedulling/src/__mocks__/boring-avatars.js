import React from 'react';

const Avatar = (props) => {
  // This is a lightweight mock for the Avatar component.
  // It renders a simple div with a test ID to ensure tests can find it.
  return <div data-testid="boring-avatar" {...props} />;
};

export default Avatar;